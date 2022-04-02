import { formatDistanceToNow, parseISO } from 'date-fns'
import { selectAllUsers } from '../users/usersSlice'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'
import { selectAllNotifications, allNotificationsRead } from './notificationsSlice'
import React, { useLayoutEffect } from 'react'


export const NotificationsList = () => {
    const notifications = useSelector(selectAllNotifications)
    const users = useSelector(selectAllUsers)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        dispatch(allNotificationsRead())
    })

    const renderedNotifications = notifications.map(notification => {
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find(user => user.id === notification.user) || {
            name: 'Unknown User'
        }
        const notificationClassname = classnames('notification', {
            new: notification.isNew
        })


        return (
            <div key={notification.id} className={notificationClassname}>
                <div>
                    <b>{user.name}</b> {notification.message}
                </div>
                <div title={notification.date}>
                    <i>{timeAgo} ago</i>
                </div>
            </div>
        )
    })

    return (
        <section className="notificationsList">
            <h2>Notifications</h2>
            {renderedNotifications}
        </section>
    )
}