import {Router} from  "express"
import {getSingeBook, getBookList, getBookTags} from "../controllers/book.js"


const router = Router()

router.get('/', getBookList)
router.get('/tags', getBookTags)
router.get('/:bookId', getSingeBook)


export default router