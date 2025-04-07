import * as Yup from 'yup';
import User from '../models/User';
import Product from '../models/Product';

class ProductController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        const { filename: path } = req.file;
        const { name, price, category_id, offer } = req.body;

        try {
            await schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const user = await User.findByPk(req.userId);

        if (!user || !user.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer,
        });

        return res.json(product);
    }

    async index(req, res) {
        try {
            const products = await Product.findAll();
            return res.json(products);
        } catch (err) {
            return res.status(500).json({ error: 'Error fetching products' });
        }
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        });

        let path;

        if (req.file) {
            path = req.file.filename;
        }

        const { name, price, category_id, offer } = req.body;

        try {
            await schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const user = await User.findByPk(req.userId);

        if (!user || !user.admin) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ error: 'Make sure your product ID is correct' });
        }

        await product.update({
            name,
            price,
            category_id,
            path,
            offer,
        });

        return res.status(200).json(product);
    }
}

export default new ProductController();
