import { Schema, model, models, Types } from 'mongoose'

const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    bio: String,
    threads: [{
        type: Types.ObjectId,
        ref: 'Thread'
    }],
    onboarded: {
        type: Boolean,
        default: false
    }, 
    communities: [ {
        type: Types.ObjectId,
        ref: 'Community'
    }]
});

const User = models.User || model('User', UserSchema);
export default User;