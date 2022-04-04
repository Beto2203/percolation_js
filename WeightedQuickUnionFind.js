
class QuickUnion {
    constructor(n) {
        this.id = new Array(n);
        this.rootSize = new Array(n);
        for (let i = 0; i < n; i++){
            this.id[i] = i;
            this.rootSize[i] = 1;
        }
    }
    union(a, b) {
        let rootA = this.find(a);
        let rootB = this.find(b);
        if (this.rootSize[rootA] >= this.rootSize[rootB]) {
            this.id[rootB] = rootA;
            this.rootSize[rootA] += this.rootSize[rootB];
        }
        else {
            this.id[rootA] = rootB;
            this.rootSize[rootB] += this.rootSize[rootA];
        }
    }
    find(a) {
        let i = a;
        while (this.id[i] !== i) {
            i = this.id[i];
        }
        this.id[a] = i;
        return i;
    };
}