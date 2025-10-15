class ExpressError extends Error
{
    constructor(status,message)
    {
        super(message)
        this.message=message,
        this.status = status
    }
}

module.exports = {ExpressError}