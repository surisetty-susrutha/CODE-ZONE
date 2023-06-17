import mongoose from "mongoose";

const user = new mongoose.Schema({
    uniqueid:String,
    language:String,
    version:String,
    filename:String,
    link:String
});

const codes = new mongoose.Schema({
    uid:String,
    language:String,
    version:String,
    code:String,
});

const User = mongoose.model('user',user);
const codefile = mongoose.model('code',codes);

export default User;
export {codefile};