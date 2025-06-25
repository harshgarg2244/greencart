

// add address : api/address/add

import Address from "../models/Address.js"

export const addAdress = async (req, res) => {
    try {
        const { address, email } = req.body
        await Address.create({ ...address, email })
        res.json({ success: true, message: "Adress Added successfully" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

export const getAddress = async (req, res) => {
    try {
        const email = req.params.email;
        const addressess = await Address.find({ email })
        res.json({ success: true, addressess });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}