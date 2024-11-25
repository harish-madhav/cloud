#include <mpi.h>
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

int main(int argc, char* argv[]) {
    int rank, size;
    int global_max = INT_MIN;
    int local_max = INT_MIN;
    int *array = NULL, *local_array = NULL;
    int array_size = 100; // Adjust as needed
    int chunk_size;

    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);

    if (rank == 0) {
        array = (int *)malloc(array_size * sizeof(int));
        for (int i = 0; i < array_size; i++) {
            array[i] = rand() % 1000; // Fill with random numbers
        }
    }

    chunk_size = array_size / size;

    // Allocate memory for local arrays
    local_array = (int *)malloc(chunk_size * sizeof(int));

    // Scatter the array to all processes
    MPI_Scatter(array, chunk_size, MPI_INT, local_array, chunk_size, MPI_INT, 0, MPI_COMM_WORLD);

    // Compute local maximum
    for (int i = 0; i < chunk_size; i++) {
        if (local_array[i] > local_max) {
            local_max = local_array[i];
        }
    }

    // Reduce to find the global maximum
    MPI_Reduce(&local_max, &global_max, 1, MPI_INT, MPI_MAX, 0, MPI_COMM_WORLD);

    if (rank == 0) {
        printf("The largest number in the array is: %d\n", global_max);
        free(array);
    }

    free(local_array);
    MPI_Finalize();
    return 0;
}
