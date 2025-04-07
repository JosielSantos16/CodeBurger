import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authCofig from '../../config/auth'

class SessionController{
    async store(req, res){

        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        })

        const userEmailOrPasswordIncorrect = () => {
            return res
            .status(400)
            .json({ error: 'Seu Email ou sua senha estao erradas'})
        }

        if (!(await schema.isValid(req.body))) userEmailOrPasswordIncorrect()
    

    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    })

    if(!user) userEmailOrPasswordIncorrect()

    if(!(await user.checkPassword(password))) userEmailOrPasswordIncorrect()

    return res.json({
        id: user.id,
        email,
        name: user.name,
        admin: user.admin,
        token: jwt.sign({ id: user.id }, authCofig.secret, {
            expiresIn: authCofig.expiresIn,
        })
    })
}
}

export default new SessionController();