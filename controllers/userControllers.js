//get user data
export const userData = async (req, res) => {
  res.send({ email: req.user.email, name: req.user.name });
};
