import { reactive, watch } from 'vue';

const defaultFactoryImages = [
    {
        src: 'https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Shoe factory production line'
    },
    {
        src: 'https://images.pexels.com/photos/4484077/pexels-photo-4484077.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Quality inspection'
    },
    {
        src: 'https://images.pexels.com/photos/3738087/pexels-photo-3738087.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Packing and shipping'
    }
];

const defaultMaterialsItems = [
    {
        image: 'https://images.pexels.com/photos/5045920/pexels-photo-5045920.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Upper materials',
        label: 'Upper',
        description: 'Mesh, knit, leather and more upper constructions for different design directions.'
    },
    {
        image: 'https://images.pexels.com/photos/7480112/pexels-photo-7480112.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Outsole materials',
        label: 'Outsole',
        description: 'EVA, rubber and compound outsoles balancing durability, cushioning and lightness.'
    },
    {
        image: 'https://images.pexels.com/photos/7439459/pexels-photo-7439459.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Paper shoe inserts',
        label: 'Inserts',
        description: 'Paper shoe inserts to improve presentation for e-commerce and in-store display.'
    },
    {
        image: 'https://images.pexels.com/photos/3738086/pexels-photo-3738086.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Studded uppers',
        label: 'Studded Uppers',
        description: 'Studs and decorative uppers suitable for bold, statement-making women’s footwear.'
    }
];

let initialFactoryImages = defaultFactoryImages;
let initialMaterialsItems = defaultMaterialsItems;

if (typeof window !== 'undefined') {
    try {
        const savedFactory = window.localStorage.getItem('factoryImages');
        if (savedFactory) {
            initialFactoryImages = JSON.parse(savedFactory);
        }
    } catch (e) {
        
    }

    try {
        const savedMaterials = window.localStorage.getItem('materialsItems');
        if (savedMaterials) {
            initialMaterialsItems = JSON.parse(savedMaterials);
        }
    } catch (e) {
        
    }
}

const store = reactive({
    products: [],
    loading: false,
    error: null,
    demoMode: false,
    factoryImages: initialFactoryImages,
    materialsItems: initialMaterialsItems,
    
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
                
                if (useStatic) {
                    data = data.map(p => {
                        if (p.images) {
                            p.images = p.images.map(img => {
                                if (img.startsWith('/uploads')) {
                                    return 'data' + img;
                                }
                                return img;
                            });
                        }
                        return p;
                    });
                }

                this.demoMode = useStatic;

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
    }
});

if (typeof window !== 'undefined') {
    watch(
        () => store.factoryImages,
        (val) => {
            try {
                window.localStorage.setItem('factoryImages', JSON.stringify(val));
            } catch (e) {
                
            }
        },
        { deep: true }
    );

    watch(
        () => store.materialsItems,
        (val) => {
            try {
                window.localStorage.setItem('materialsItems', JSON.stringify(val));
            } catch (e) {
                
            }
        },
        { deep: true }
    );
}

export default store;
