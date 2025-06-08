const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_pJ90T0jCpU5Dn7tq8Xkq2/3i2ew=",
  privateKey: "private_HgwoLFH3IYdBY9A8+3QnO//WY0c=",
  urlEndpoint: "https://ik.imagekit.io/MohamedAhmed/codeny/", // رابط مكتبة الصور
});

module.exports = imagekit;