module.exports = fn => {
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}
// catch async chi hoat. dong vs ham` async thoi