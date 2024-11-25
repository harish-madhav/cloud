#include<stdio.h>
#include<omp.h>

int main(){
    int x=5;
    int y=0;
    printf("%d %d\n",x,y);
    #pragma omp parallel for firstprivate(x) lastprivate(y)
    for(int i=0;i<=20;i++)
    {
        x+=i;
        y=i;
    }
    printf("%d %d",x,y);
}
