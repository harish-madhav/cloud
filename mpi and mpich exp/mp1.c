#include<stdio.h>
#include<mpi.h>

int main(int argc,char** argv)
{
    MPI_Init(NULL,NULL);
    int size;
    MPI_Comm_size(MPI_COMM_WORLD,&size);
    int rank;
    MPI_Comm_rank(MPI_COMM_WORLD,&rank);
    if(size<0)
    {
        if(rank==0)
        {
            printf("atleast 4 process needed");
        }
        MPI_Finalize();
        return 0;
    }
    int num;
    if(rank==0)
    {
        for(int i=1;i<=3;i++)
        {
            MPI_Recv(&num,1,MPI_INT,i,0,MPI_COMM_WORLD,MPI_STATUSES_IGNORE);
            printf("The process 0 received %d\n",num,i);
        }
    }
    else if(rank>=1 && rank <=3)
    {
        for(int i=1;i<=3;i++)
        {
            num=rank*i;
            MPI_Send(&num,1,MPI_INT,0,0,MPI_COMM_WORLD);
            printf("process 0 receives %d from %d\n",num,i);
        }
    }
    MPI_Finalize();
    return 0;

}
