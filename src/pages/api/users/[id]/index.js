import users from '@/data/db';
import fs from "fs";
import path from 'path';

const handler = (req, res) => {

    const dbPath = path.join(process.cwd(), "src", "data", "db.json");
    const data = fs.readFileSync(dbPath);
    const parsedData = JSON.parse(data);

    if (req.method === "GET") {
        const { id } = req.query;
        const user = parsedData.users.find(x => x.id == id)

        if (user)
            return res.status(200).json(user);
        else
            return res.status(404).json({ message: "User not found !" });

    } else if (req.method === "DELETE") {
        const { id } = req.query;
        const isUser = parsedData.users.some(x => String(x.id) === id);

        if (isUser) {
            const newUsers = parsedData.users.filter(x => String(x.id) !== id);
            const err = fs.writeFileSync(dbPath, JSON.stringify({ ...parsedData, users: newUsers }));

            if (err)
                return res.json({ message: "server err" })
            else
                return res.json({ message: "User removed successfully :))" });


        } else
            return res.status(404).json({ message: "User not found" });


    } else if (req.method === "PUT") {
        const { id } = req.query;
        const { username, email, password } = req.body;

        const isUser = parsedData.users.some(x => String(x.id) === id);

        if (isUser) {
            parsedData.users.some(x => {
                if (String(x.id) === id){
                    x.username = username;
                    x.email = email;
                    x.password = password;
                }
            });

            const err = fs.writeFileSync(dbPath,JSON.stringify({...parsedData}));
            if(err)
                res.json({message:"Server error !!"});
            else
                res.json({message:"User updated successfully !!"});


        } else
            res.status(404).json({ message: "User not found !!" });

    }
}

export default handler