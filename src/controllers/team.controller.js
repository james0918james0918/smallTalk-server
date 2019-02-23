export const teamController = (router) => {
  router.post('/addTeam', (req,res) => {
    if(req.body.description) res.send("values is defined");
    else res.status(404).send("not defined");
  });

  return router;
}