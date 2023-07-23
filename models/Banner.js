const mongoose = require("mongoose");
const BannerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);