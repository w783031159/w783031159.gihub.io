import { reactive, watch } from 'vue';

const store = reactive({
    products: [],
    loading: false,
    error: null,
    
    async fetchProducts() {
        this.loading = true;
        try {
            let useStatic = false;
            let res;
            
            try {
                res = await fetch('/api/products');
                if (!res.ok) throw new Error('API failed');
            } catch (e) {
                console.warn('Backend API unavailable, attempting to load static data...');
                useStatic = true;
                res = await fetch('./data/products.json');
            }

            if (res.ok) {
                let data = await res.json();
                
                // Fix image paths if running in static mode (GitHub Pages)
                if (useStatic) {
                    data = data.map(p => {
                        if (p.images) {
                            p.images = p.images.map(img => {
                                if (img.startsWith('/uploads')) {
                                    return 'data' + img; // Convert /uploads/x to data/uploads/x (relative)
                                }
                                return img;
                            });
                        }
                        return p;
                    });
                }

                this.products = data;
            } else {
                this.error = 'Failed to load products';
            }
        } catch (e) {
            this.error = e.message;
        } finally {
            this.loading = false;
        }
    },

    async addProduct(product) {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(product)
            });
            if (res.ok) {
                const newProduct = await res.json();
                this.products.push(newProduct);
                return newProduct;
            }
            throw new Error('Backend unavailable (Demo Mode)');
        } catch (e) {
            alert('Operation failed: Backend server is not available in this demo.');
            throw e;
        }
    },

    async updateProduct(id, updates) {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                const idx = this.products.findIndex(p => p.id === id);
                if (idx !== -1) {
                    Object.assign(this.products[idx], updates);
                }
            } else {
                throw new Error('Backend unavailable');
            }
        } catch (e) {
            alert('Operation failed: Backend server is not available in this demo.');
        }
    },

    async deleteProduct(id) {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                this.products = this.products.filter(p => p.id !== id);
            } else {
                throw new Error('Backend unavailable');
            }
        } catch (e) {
            alert('Operation failed: Backend server is not available in this demo.');
        }
    }
});

export default store;
