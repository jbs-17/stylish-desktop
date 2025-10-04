import JBS from "jbs-web-server";
import { searchFileInfoTemp, searchFileInfoUpload } from "../apis/db/media-search-temp.js";

const media = JBS.Router();

media.get('/temp/:fileUID', async (req, res) => {
  const { fileUID } = req.params;
  if (!fileUID) {
    res.json({
      status: false,
      message: 'file uid tidak valdi'
    })
  }
  res.json(await searchFileInfoTemp(req.params.fileUID));
})



media.get('/upload/:fileUID', async (req, res) => {
  const { fileUID } = req.params;
  if (!fileUID) {
    res.json({
      status: false,
      message: 'file uid tidak valdi'
    })
  }
  res.json(await searchFileInfoUpload(req.params.fileUID));
})




export default media;