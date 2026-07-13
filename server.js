import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { createServer } from 'http'
import mongoose from 'mongoose';
import { type } from 'os';
import bcrypt from 'bcrypt';
import { asyncWrapProviders } from 'async_hooks';
import jwt from 'jsonwebtoken';
import path from 'path';

import { authMiddleware } from './backendJSfiles/authMiddleware.js';
import { asyncHandler } from './backendJSfiles/asyncHandler.js';
import { User } from './backendJSfiles/models/user.js';
import { Image } from './backendJSfiles/models/image.js';

const PORT = 3333;
const app = express();
const httpServer = createServer(app);

app.use(express.json())
app.use(express.static("public"))
app.use('/images', express.static('images'))

const connectToMongoDB = async ()=>{
    await mongoose.connect(process.env.MONGODB_PASS)
    console.log('We are connected')
};

app.get('/favicon.ico', (req, res) => res.status(204));


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images/');
    },
    
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .png, .gif & .webp is allowed!'), false);
        }
    }
 })


app.get(
    "/api/images", 
    asyncHandler(async (req, res)=>{
        const images = await Image.find()
        .populate("owner", "username")
        .lean();
        res.json(images);
    })
);

app.get(
    "/api/images/my", 
    authMiddleware, 
    asyncHandler(async (req, res)=>{
        const images = await Image.find({ owner: req.user._id });
        res.json(images);
    })
);

app.post(
    "/api/images/otherChannel",
    asyncHandler(async (req, res)=>{
        const images = await Image.find({ owner: req.body.channelId })
        res.json(images);
    })
);

app.post(
    '/api/upload', 
    authMiddleware, 
    upload.single('image'), 
    asyncHandler(async (req, res)=>{
        const rawTags = req.body.tags || "";
        const tags = [...new Set(
            req.body.tags
                .split(",")
                .map(tag => tag.trim().toLowerCase())
                .filter(Boolean)
        )].slice(0, 10)
        const image = new Image({
            owner: req.user._id,
            filename: req.file.filename,
            tags: tags
        })
        await image.save();
        res.json({
            message: 'Image Uploaded',
            image
        })
    })
)

app.post(
    '/api/signup', 
    asyncHandler(async (req, res, next)=>{
        const { username, password } = req.body;
        
        const existsUser = await User.findOne({ username: username });
        if (existsUser) {
            return res.status(409).send({
                message: 'Username already registered!'
            })
        }

        const hashedPw = await bcrypt.hash(password, 10)

        const newDoc = new User({
            username: username,
            passwordHash: hashedPw
        });
        await newDoc.save();



        const jwToken = jwt.sign(
            { 
                id: newDoc._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        )

        return res.status(201).send({ 
            message: `Registered as ${username}`,
            jwToken: jwToken,
            userId: newDoc._id,
            following: []
        });
    })
);

app.post(
    '/api/login', 
    asyncHandler(async (req, res, next)=>{
        const { username, password } = req.body;
        const existsUser = await User.findOne({ username: username});

        if (!existsUser) {
            return res.status(401).send({
                message: "Invalid username or password"
            })
        }

        const passwordIsCorrect = await bcrypt.compare(
            password,
            existsUser.passwordHash
        )

        if (!passwordIsCorrect) {
            return res.status(401).send({
                message: "Invalid username or password"
            })
        }
        const newToken = jwt.sign(
            { 
                id: existsUser._id
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}  
        )

        const populatedUser = await User.findById(existsUser._id)
            .populate("following", "username")

        return res.status(201).send({
            message: `You're logged in as ${username}`,
            jwToken: newToken,
            userId: existsUser._id,
            following: populatedUser.following.map(user => ({
                id: user._id,
                username: user.username
            }))
        })
    })
);

app.post('/api/jwtlogin', authMiddleware, async (req, res)=>{
        const newJWT = jwt.sign(
            {
                id: req.user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        const populatedUser = await req.user.populate("following", "username");

        res.status(200).send({
            message: `You're logged in as ${req.user.username}`,
            jwToken: newJWT,
            userId: req.user._id,
            following: populatedUser.following.map(user => ({
                id: user._id,
                username: user.username
            }))
        })
})

app.delete(
    '/api/deleteaccount', 
    asyncHandler(async (req, res)=>{
        const { username, password } = req.body;

        const existsUser = await User.findOne({ username: username })

        if (!existsUser) {
            return res.status(401).send({
                message: "Invalid username or password"
            })
        }


        const passwordIsCorrect = await bcrypt.compare(
            password,
            existsUser.passwordHash
        )

        if (!passwordIsCorrect) {
            return res.status(401).send({
                message: "Invalid username or password"
            })
        }

        const images = await Image.find({ owner: existsUser._id});

        await Promise.all(
            images.map(async image => {
                try{
                    await fs.unlink(image.filename)
                } catch (err) {
                    console.error(`Could not delete file ${image.filename}:`, err);
                }
            })
        );

        await Image.deleteMany({ owner: existsUser._id })
        await existsUser.deleteOne();

        res.status(200).send({
            message: "Account deleted"
        })
    })
);

app.post(
    "/api/like", 
    authMiddleware, 
    asyncHandler(async (req, res)=>{
        const image = await Image.findByIdAndUpdate(
            req.body.imgId,
            {
                $addToSet: {
                    likes: req.user.id
                }
            },
            {
                returnDocument: "after"
            }
        );
        res.json(image)
    })
);

app.post(
    "/api/unlike", 
    authMiddleware, 
    asyncHandler(async (req, res)=>{
        const image = await Image.findByIdAndUpdate(
            req.body.imgId,
            {
                $pull: {
                    likes: req.user._id
                }
            },
            {
                returnDocument: "after"
            }
        );
        
        res.json(image);
    })
);

app.post(
    "/api/follow",
    authMiddleware,
    asyncHandler(async (req, res)=>{
        const { userToFollowId } = req.body;

        if (req.user._id === userToFollowId) {
            return res.status(500).send({
                success: true,
                message: "You can't follow yourself."
            })
        }
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: {
                    following: userToFollowId
                }
            }
        )
        res.status(200).json({
            success: true,
            message: "Followed successfully"
        })
    })
)

app.delete(
    "/api/unfollow",
    authMiddleware,
    asyncHandler(async (req, res)=>{
        const { userToFollowId } = req.body;
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    following: userToFollowId
                }
            }
        )
        res.status(200).json({
            success: true,
            message: "Unfollowed successfully"
        })
    })
)

app.delete(
    "/api/deleteimg", 
    authMiddleware, 
    asyncHandler(async (req, res)=>{
        const { imgId } = req.body

        if (!imgId) {
            return res.status(400).json({ message: "imgId is required" });
        }

        const img = await Image.findOne({
            _id: imgId, 
            owner: req.user._id
        })

        if (!img) {
            return res.status(404).json({ message: "Image not found" });
        }

        try {
            await fs.unlink(`images/${img.filename}`);
        } catch(error) {
            return res.status(500).json({
                message: "Failed to delete image file"
            })
        }

        await img.deleteOne();

        res.status(200).json({
            success: true,
            deletedId: img._id,
            message: "Image deleted successfully"
        });
    })
);


app.use((err, req, res, next)=>{
    console.error(err)
    res.status(err.status || 500).json({
        message: err.message
    })
})


const start = async ()=>{
    await connectToMongoDB()
    httpServer.listen(PORT, ()=>{
        console.log(`Domain is: http://localhost:${PORT}/`)
    })
}

start();
