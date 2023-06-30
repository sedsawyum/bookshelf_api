import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient()

const getEvent = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    if (!event) {
        throw {
            status: 404,
            message: 'Event with given id does not exist!'
        }
    }

    return event
}


const createEvent = async ({bookId, userId, eventDate, title, city, byInvitation, ageRegulation}) => {
    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })

    if (!book) {
        throw {
            status: 404,
            message: 'Instance of a book with given id does not exist!'
        }
    }

    const existingEvent = await prisma.event.findMany({
        where: {
            bookId,
            userId
        }
    })

    if (existingEvent.length > 0) {
        throw {
            status: 400,
            message: 'Event for this book already exists!'
        }
    }

    return prisma.event.create({
        data: {
            userId,
            bookId,
            city,
            title,
            byInvitation,
            ageRegulation,
            eventDate: new Date(eventDate)
        }
    })
}


const updateEvent = async ({eventId, eventBody}) => {
    const {eventDate} = eventBody

    const event = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    if (!event) {
        throw {
            status: 404,
            message: 'Event with provided id does not exist!'
        }
    }


    return prisma.event.update({
        where: {
            id: eventId
        },
        data: {
            ...eventBody,
            eventDate: eventDate ? new Date(eventDate) : event.eventDate,
        }
    })
}


const deleteEvent = async (eventId) => {
    const eventToDelete = await prisma.event.findUnique({
        where: {
            id: eventId
        }
    })

    if (!eventToDelete) {
        throw {
            status: 404,
            message: 'Event with given id does not exist!'
        }
    }

    await prisma.event.delete({
        where: {
            id: eventId
        }
    })
}


export default {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}