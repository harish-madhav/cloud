#include<stdio.h>
#include<omp.h>

int main(){
    int N=1000;
    int arr[N];
    int sum=0;
    for(int i=0;i<N;i++)
    {
        arr[i]=i+1;
    }
    #pragma omp parallelfor reduction(+:sum)
    for(int i=0;i<N;i++)
    {
        sum+=arr[i];
    }
    printf("%d",sum);
    return 0;
}
