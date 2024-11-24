import users from "@/data/db";
import fs from "fs";
import path from 'path';


const Users = (req, res) => {
  //   return res.json();
  //   console.log(req.method);
  const dbPath = path.join(process.cwd(), "src", "data", "db.json");
  const data = fs.readFileSync(dbPath);
  const parsedData = JSON.parse(data);

  switch (req.method) {
    case "GET": {
      return res.json({ message: "Users Loaded successfully :))", data: parsedData.users });
    }
    case "POST": {
      const { username, email, password } = req.body;
      
      // console.log("parsedData =>",parsedData.users);
      // console.log("body =>", req.body);
      
      parsedData.users.push({
        id:crypto.randomUUID(),
        username,
        email,
        password
      });
      
      const err = fs.writeFileSync(dbPath,JSON.stringify(parsedData));
     
      if(err){
        return res
          .status(500)
          .json({ message: "Internal server Error", data: users });
      }
      else{
        return res
                .status(201)
                .json({message:"User added successfully",data:users});
      }
    }
  }
}

export default Users