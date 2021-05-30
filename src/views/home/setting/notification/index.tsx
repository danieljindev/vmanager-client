/**
 * 消息通知
 */
import React, { useState, useEffect } from 'react'
import './style.scss'
import { Switch, Divider } from 'antd'
import { serviceGetUserConfig, serviceUpdateUserConfig } from '@/services'

const NotificationPage: React.FC = function () {
  const [userConfig, setUserConfig] = useState({
    isMatterNotify: true,
    isTaskNotify: true
  })

  useEffect(() => {
    serviceGetUserConfig().then(res => {
      if (res.data.success) {
        setUserConfig({
          ...res.data.data
        })
      }
    })
  }, [])

  function handleUpdateUserConfig(type: number, checked: boolean) {
    const fields: any = {
      0: 'isTaskNotify',
      1: 'isMatterNotify'
    }
    serviceUpdateUserConfig({
      [fields[type]]: checked
    }).then(res => {
      if (res.data.success) {
        setUserConfig({
          ...userConfig,
          [fields[type]]: checked
        })
      }
    })
  }

  return (
    <div className="notification">
      <Divider orientation="left" plain>Notification Setting</Divider>
      <div className="list">
        <div className="left">
          <h4 className="title">Upcoming Tasks</h4>
          <p className="description">After opening, it will be notified in the form of an internal mail and sent to the mailbox, otherwise only the internal mail will be notified.</p>
        </div>
        <Switch
          checked={userConfig.isTaskNotify}
          onChange={handleUpdateUserConfig.bind(null, 0)}
        />
      </div>
      <div className="list">
        <div className="left">
          <h4 className="title">Reminder</h4>
          <p className="description">After opening, it will be notified in the form of an internal mail and sent to the mailbox, otherwise only the internal mail will be notified.</p>
        </div>
        <Switch
          checked={userConfig.isMatterNotify}
          onChange={handleUpdateUserConfig.bind(null, 1)}
        />
      </div>
    </div>
  )
}

export default NotificationPage
