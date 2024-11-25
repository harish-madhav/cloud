#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<ctype.h>
#include<omp.h>

int main()
{
    char s[100];
    fgets(s,sizeof(s),stdin);
    int l=strlen(s);
    int t=0;
    #pragma omp parallel for default(shared) reduction(+:t)
    for(int i=0;i<l;i++)
    {
        if(i==0 && !isspace(s[i]) || isspace(s[i-1]) && !isspace(s[i]))
        {
            t++;
        }
    }
    printf("%d",t);
    return 0;
}
