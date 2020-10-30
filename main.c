#include <stdio.h>

void get_file_data(char file_name) {
    char data = "";
    FILE *file;
    file = fopen(file_name, "r");
    if (file) {
        while (getc(file) != EOF) {
            data += getc(file);
        }
        fclose(file);
    }
    return data;
}


int main() {

    char data = get_file_data("input1.txt");
    printf("%c", data);

    

    int c;
    FILE *file;
    file = fopen("input1.txt", "r");
    if (file) {
        while ((c = getc(file)) != EOF)
            putchar(c);
        fclose(file);
    }
    return 0;
}
