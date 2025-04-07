import User from '../models/User';
import * as Yup from 'yup';
import { v4 } from 'uuid';

class userController {
    async store(req, res) {
        const { name, email, password, admin } = req.body;

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        });

        try {
            await schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        });

        return res.status(201).json(user);
    }
}

export default new userController();
