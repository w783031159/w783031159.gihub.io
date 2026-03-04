import { reactive } from 'vue';

const defaultFactoryImages = [];

const defaultMaterialsItems = [];

const defaultHomeCoverImage = '';

const store = reactive({
    products: [],
    loading: false,
    error: null,
    demoMode: false,
    factoryImages: defaultFactoryImages,
    materialsItems: defaultMaterialsItems,
    homeCoverImage: defaultHomeCoverImage,
    
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

                if (Array.isArray(data)) {
                    const productsArray = [];
                    let factoryItems = null;
                    let materialsItems = null;
                    let homeCover = null;

                    for (const entry of data) {
                        if (entry && entry.type === 'factory' && Array.isArray(entry.items)) {
                            factoryItems = entry.items;
                        } else if (entry && entry.type === 'materials' && Array.isArray(entry.items)) {
                            materialsItems = entry.items;
                        } else if (entry && entry.type === 'homeCover' && entry.image) {
                            homeCover = entry.image;
                        } else {
                            productsArray.push(entry);
                        }
                    }

                    if (useStatic) {
                        for (const p of productsArray) {
                            if (p.images) {
                                p.images = p.images.map(img => {
                                    if (typeof img === 'string' && img.startsWith('/uploads')) {
                                        return 'data' + img;
                                    }
                                    return img;
                                });
                            }
                        }
                    }

                    this.products = productsArray;
                    this.factoryImages = factoryItems && factoryItems.length > 0 ? factoryItems : defaultFactoryImages;
                    this.materialsItems = materialsItems && materialsItems.length > 0 ? materialsItems : defaultMaterialsItems;
                    this.homeCoverImage = homeCover ? homeCover : defaultHomeCoverImage;
                } else {
                    this.products = [];
                    this.factoryImages = defaultFactoryImages;
                    this.materialsItems = defaultMaterialsItems;
                    this.homeCoverImage = defaultHomeCoverImage;
                }

                this.demoMode = useStatic;
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
        if (this.demoMode) {
            const newProduct = {
                ...product,
                id: product.id || String(Date.now())
            };
            this.products.push(newProduct);
            return newProduct;
        }

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
        if (this.demoMode) {
            const targetId = String(id);
            const idx = this.products.findIndex(p => String(p.id) === targetId);
            if (idx !== -1) {
                Object.assign(this.products[idx], updates);
            }
            return;
        }

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
        if (this.demoMode) {
            const targetId = String(id);
            this.products = this.products.filter(p => String(p.id) !== targetId);
            return;
        }

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
    },

    async saveHomeVisuals() {
        if (this.demoMode) {
            alert('当前是静态预览模式，无法保存到服务器。');
            return;
        }

        try {
            const res = await fetch('/api/home-config', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    factoryImages: this.factoryImages,
                    materialsItems: this.materialsItems,
                    homeCoverImage: this.homeCoverImage
                })
            });
            if (!res.ok) {
                throw new Error('Failed to save home config');
            }
        } catch (e) {
            alert('保存工厂和材质配置失败：后端服务不可用。');
            throw e;
        }
    }
});

export default store;
