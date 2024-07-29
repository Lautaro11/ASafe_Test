import * as s3 from "./src/s3";
import * as utils from "./src/utils";
require('dotenv').config();



export default { ...s3, ...utils };
