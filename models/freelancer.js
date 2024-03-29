const { Schema, model} =require('mongoose');

    const FreeSchema = Schema(
        {
        desc: {
            type: String,
            required: false
        },
        exp: {
            type: String,
            default: 'Menos de 1 año de experiencia'
        },
        skills:{
            type: [String],
            required: false
        },
        social: {
            media :{
                facebook : String,
                whatsapp : String,
                linkedin : String,
                github   : String,
                youtube  : String,
                instagram: String,
                twitter  : String,
            },
            required: false
        },
        categories:{
            type: [Schema.Types.ObjectId],
            ref: 'Category',
            required: true
        },
        rank: {
            type: String,
            default: '1'
        },
        usuario:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        img: {type: [String],
        required: false},    
    },
    {
        timestamps: true,
        versionKey: false
    }
    );
    FreeSchema.methods.toJSON = function() {
        const {createdAt, updatedAt, _id, ...free} = this.toObject();
        free.uid = _id;
        return free;
    }
    module.exports = model('Freelancer',FreeSchema);