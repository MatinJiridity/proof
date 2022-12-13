const router = express.Router();

router.get('/group', getGroup);

export const getGroup = async (req, res) => {
  
    const groupIns = new Group();

    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)
    groupIns.addMember(new Identity().commitment)

    console.log(groupIns.members)

    try {
      res.status(200).json({ group: groupIns });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
  