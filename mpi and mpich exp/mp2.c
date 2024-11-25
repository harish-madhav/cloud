#include<stdio.h>
#include<stdlib.h>
#include<mpi.h>
#include<time.h>

int main(int argc,char** argv)
{
    int i,rank,size,count=0,tc=0;
    long long int tp=1000000;
    long long int lp;
    double x,y;
    double pi;

    MPI_Init(&argc,&argv);
    MPI_Comm_size(MPI_COMM_WORLD,&size);
    MPI_Comm_rank(MPI_COMM_WORLD,&rank);

    lp=tp/size;
    srand(time(NULL)+rank);
    for(int i=0;i<lp;i++)
    {
        x=(double)rand()/RAND_MAX;
        y=(double)rand()/RAND_MAX;
        if(x*x+y*y<=1.0)
        {
            count++;
        }
    }
    MPI_Reduce(&count,&tc,1,MPI_INT,MPI_SUM,0,MPI_COMM_WORLD);
    if(rank==0)
    {
        pi=(4.0*tc)/tp;
        printf("the pie value is %f\n",pi);
    }
    MPI_Finalize();
    return 0;
}
