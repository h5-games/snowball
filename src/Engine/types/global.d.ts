type Keys<T> = { [P in keyof T]: P }[keyof T];
