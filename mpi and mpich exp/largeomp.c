#include <stdio.h>
#include <stdlib.h>
#include <omp.h>
#include <limits.h>

int main() {
    int array_size, global_max = INT_MIN;
    int *array;

    printf("Enter the size of the array: ");
    scanf("%d", &array_size);

    array = (int *)malloc(array_size * sizeof(int));

    printf("Enter the elements of the array:\n");
    for (int i = 0; i < array_size; i++) {
        scanf("%d", &array[i]);
    }

    #pragma omp parallel
    {
        int local_max = INT_MIN;

        // Find local maximum in each thread
        #pragma omp for
        for (int i = 0; i < array_size; i++) {
            if (array[i] > local_max) {
                local_max = array[i];
            }
        }

        // Reduce to find the global maximum
        #pragma omp critical
        {
            if (local_max > global_max) {
                global_max = local_max;
            }
        }
    }

    printf("The largest number in the array is: %d\n", global_max);

    free(array);
    return 0;
}
