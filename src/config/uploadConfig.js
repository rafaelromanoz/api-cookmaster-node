const multer = require('multer');
const path = require('path');

const directory = path.resolve(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: directory,
  filename: (req, file, callback) => {
    const { id } = req.params;
    return callback(null, `${id}.jpeg`);
  },
});

module.exports = {
  upload: multer({ storage }),
};