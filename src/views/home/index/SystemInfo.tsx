import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './style.scss'
import bytes from 'bytes'
import CONFIG from '@/config'
import { Row, Col, Card, Progress, Empty } from 'antd'
import { totalPercentage, formatDateTime } from '@/utils'
import { serviceGetInnerMessage } from '@/services'

interface Props {
  systemInfo: {
    [key: string]: any
  }
}

const statusColor = (percentage: number) => {
  if (percentage < 40) return '#52c41a'
  if (percentage < 80) return '#ffa500'
  return '#f50'
}
let timer: any

const System: React.FC<Props> = ({ systemInfo }) => {
  const [curSystemTime, setCurSystemTime] = useState('')
  const [messageList, setMessageList] = useState([])
  const [loading, setLoading] = useState(true)

  const memPercentage = useMemo(() => {
    return totalPercentage(systemInfo.totalmem, systemInfo.freemem)
  }, [systemInfo.totalmem, systemInfo.freemem])

  // 倒计时
  const countdown = useCallback(() => {
    clearTimeout(timer)
    const timeDiff = systemInfo.currentSystemTime + (Date.now() - systemInfo.currentSystemTime)
    setCurSystemTime(formatDateTime(timeDiff))

    timer = setTimeout(() => {
      countdown()
    }, 1000)
  }, [systemInfo.currentSystemTime])

  useEffect(() => {
    countdown()

    return () => {
      clearTimeout(timer)
    }
  }, [countdown])

  useEffect(() => {
    serviceGetInnerMessage({ pageSize: 5 })
    .then(res => {
      if (res.data.success) {
        setLoading(false)
        setMessageList(res.data.data.rows)
      }
    })
  }, [])

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24}} className="system-data">
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title="System Parameters"
          hoverable
          loading={!systemInfo.nodeVersion}
        >
          <p className="item-text">
            <em>System Type：</em>
            {systemInfo.platform}{systemInfo.arch}
          </p>
          <p className="item-text">
            <em>Node Version：</em>
            {systemInfo.nodeVersion}
          </p>
          <p className="item-text">
            <em>MySQL Version：</em>
            {systemInfo.mysqlVersion}
          </p>
          <p className="item-text">
            <em>Current Environment：</em>
            {CONFIG.isProduction ? 'Production' : 'Development'}
          </p>
          <p className="item-text">
            <em>System Time：</em>
            {curSystemTime}
          </p>
        </Card>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title="My Message"
          hoverable
          loading={loading}
        >
          {messageList.length > 0 ? (
            messageList.map((msg: any) => (
              <p className="item-text" key={msg.id}>
                <em>{msg.content}</em>
              </p>
            ))
          ) : (
            <Empty />
          )}
        </Card>
      </Col>
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <Card
          title={`Memory Usage(${bytes(systemInfo.totalmem)})`}
          hoverable
          className="mem"
        >
          <Progress
            type="circle"
            percent={memPercentage}
            strokeColor={statusColor(memPercentage)}
            format={percent => percent + '%'}
          />
          <div className="surplus">{bytes(systemInfo.freemem)} Remained</div>
        </Card>
      </Col>
    </Row>
  )
}

export default React.memo(System)
