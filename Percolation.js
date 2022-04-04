class Percolation {
    constructor(n) {
        this.uf = new QuickUnion((n*n + 1));
        this.grid = new Array((n*n + 1));
        this.roots = new Array((n*n + 1));
        this.nSize = n;
        this.numOpen = 0;
        this.percolationChecker = 0b0;

        for (let i = 1; i <= this.nSize**2; i++) {
            this.grid[i] = 0b0;
            this.roots[i] = 0b0;
            if (i <= n) {
                this.uf.union(0, i);
                this.grid[i] |= 0b10;
            }
            if (i > n*(n-1)) {
                this.grid[i] |= 0b100;
            }
        }
    }
    open(row, col) {
        this.validate(row, col);

        if (!this.isOpen(row, col)) {
            this.grid[(row-1)*this.nSize + col] |= 0b1;
            this.numOpen++;

            if (row - 1 > 0 && this.isOpen(row-1, col)) {
                this.grid[(row-1)*this.nSize + col] |= this.roots[this.uf.find((row-2)*this.nSize + col)];
                this.uf.union((row-1)*this.nSize + col,(row-2)*this.nSize + col);
            }
            if (row + 1 <= this.nSize && this.isOpen(row+1, col)) {
                this.grid[(row-1)*this.nSize + col] |= this.roots[this.uf.find((row)*this.nSize + col)];
                this.uf.union((row-1)*this.nSize + col,(row)*this.nSize + col);
            }
            if (col - 1 > 0 && this.isOpen(row, col - 1)) {
                this.grid[(row-1)*this.nSize + col] |= this.roots[this.uf.find((row-1)*this.nSize + col - 1)];
                this.uf.union((row-1)*this.nSize + col, (row-1)*this.nSize + col - 1);
            }
            if (col + 1 <= this.nSize && this.isOpen(row, col + 1)) {
                this.grid[(row-1)*this.nSize+ col] |= this.roots[this.uf.find((row-1)*this.nSize + col + 1)];
                this.uf.union((row-1)*this.nSize + col, (row-1)*this.nSize + col + 1);
            }

            this.roots[this.uf.find((row-1)*this.nSize + col)] |= this.grid[(row-1)*this.nSize + col];

            if (this.percolationChecker !== 0b111) {
                this.percolationChecker = this.roots[this.uf.find((row-1)*this.nSize + col)];
            }
        }
    };

    isOpen(row, col) {
        this.validate(row, col);
        return (this.grid[(row-1)*this.nSize + col] & 0b1) === 0b1;
    };

    isFull(row, col) {
        this.validate(row, col);
        return this.isOpen(row, col) && this.uf.find(0) === this.uf.find((row-1)*this.nSize + col);
    };

    get numberOfOpen() {
        return this.numOpen;
    };

    get percolates() {
        return (this.percolationChecker & 0b111) === 0b111;
    };

    validate(row, col) {
        if (row < 1 || col < 1 || row > this.nSize || col > this.nSize) {
            throw "Invalid input";
        }
    };
}