import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User'

class CategoryController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin} = await User.findByPk(req.userId)

        if(!isAdmin){
            return res.status(401).json()
        }

        const { name } = req.body;

        const categoryExists = await Category.findOne({ where: { name } });

        if (categoryExists) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'File is required' });
        }

        const { filename: path } = req.file;

        try {
            const category = await Category.create({ name, path });
            return res.status(201).json({
                id: category.id,
                name: category.name,
                path: category.path,
            });
        } catch (err) {
            return res.status(500).json({ error: 'Failed to create category' });
        }
    }

    async index(req, res) {
        try {
            const categories = await Category.findAll();
            return res.json(categories);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to retrieve categories' });
        }
    }
}

export default new CategoryController();
