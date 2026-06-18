#include <unistd.h>
#include <stdio.h>

int main() {
    char buf[8];
    for (int i = 0; i <= 10000; i++) {
        int len = sprintf(buf, "%d\n", i);
        write(1, buf, len);
    }
}