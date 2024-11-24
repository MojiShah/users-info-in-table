const handler = (req,res) => {
    const {params} = req.query;
    console.log(params);
    res.status(200).json({message:"This message is from api slug !..   "});
}

export default handler;