// pkgs:
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from 'config';

// utils:
import User from '../models/user.model';

// get token secret key:
const { token_gen_sec_key } = config.get('server');

// get all users
export const getRegisteredUsers = async (req: any, res: any): Promise<void> => {
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch (err) {
        res.status(500).json({
            message: `Something went wrong, Please try again later`,
            error: err,
        });
    }
};

// crete new user handler
export const signupHandler = async (req: any, res: any): Promise<void> => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    try {
        const existedUser = await User.findOne({ email });

        if (existedUser)
            return res
                .status(400)
                .json({ message: `This user is already existed: ${email}` });

        if (password !== confirmPassword)
            return res
                .status(400)
                .json({ message: `Passwords not matched each other.` });

        const hashedPassword = await bcrypt.hash(password, 12);

        const createdUser = await User.create({
            email: email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
        });

        const userToken = jwt.sign(
            { email: createdUser, id: createdUser._id },
            token_gen_sec_key,
            {
                expiresIn: `1h`,
            }
        );

        res.status(201).json({ auth: createdUser, token: userToken });
    } catch (err) {
        res.status(500).json({
            message: `Something went wrong`,
            error: err,
        });
    }
};

// logging existed user handler
export const SignInHandler = async (req: any, res: any): Promise<void> => {
    const { email, password } = req.body;

    try {
        const existedUser = await User.findOne({ email });
        if (!existedUser)
            return res.status(404).json({
                message: `No user registered with this email: ${email}`,
            });

        const { password: currUserPass }: any = existedUser;
        const isPasswordCorrect = await bcrypt.compare(password, currUserPass);

        if (!isPasswordCorrect)
            return res.status(400).json({ message: `Invalid credentials` });

        const userToken = jwt.sign(
            { email: existedUser, id: existedUser._id },
            token_gen_sec_key,
            {
                expiresIn: `1h`,
            }
        );

        res.status(200).json({ auth: existedUser, token: userToken });
    } catch (err) {
        res.status(500).json({
            message: `Something went wrong`,
            error: err,
        });
    }
};
