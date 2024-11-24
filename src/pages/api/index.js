const users = [
  {id:1,name:"amin",gmail:"amin@gmail.com",password:"amin1212"},
  {id:2,name:"amir",gmail:"amir@gmail.com",password:"amir1215"},
];

const Api = (req,res) => {
  // console.log("Request method =>",req.method);
  switch(req.method){
    case "GET":
      return res.json({message:"Welcome to next-js api-route"});
    case "POST":{
      console.log('Request Body=>',req.body);
      const {username,email,password} = req.body;
      users.push({id:users.length+1,username,email,password})
      return res.json({ message: "User created successfully :))", data: users })
    }
    case "PUT":
      return res.json({message:"User Replaced successfully :))"})
    case "DELETE":
      return res.json({message:"User Removed successfully :))"})
  }
}

export default Api