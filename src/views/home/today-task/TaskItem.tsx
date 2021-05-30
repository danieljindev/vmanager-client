import React from 'react'
import './style.scss'
import { serviceDeleteTask, serviceUpdateTask } from '@/services'
import {
  Card,
  Button,
  Rate,
  Popconfirm
} from 'antd'
import { formatDateTime } from '@/utils'

interface Props {
  data: { [key: string]: any },
  reloadData(): void
}

const TaskItem: React.FC<Props> = ({ data, reloadData }) => {

  // 0=删除, 1=开始/完成, 2=回退
  function handleAction(buttonType: number) {
    if (buttonType === 0) {
      serviceDeleteTask(data.id)
      .then(res => {
        if (res.data.success) {
          reloadData()
        }
      })
    } else {
      serviceUpdateTask(data.id, {
        rollback: buttonType === 2 && true
      })
      .then(res => {
        if (res.data.success) {
          reloadData()
        }
      })
    }
  }

  return (
    <Card
      title="Task"
      hoverable
      className="task-component"
    >
      <p className="content">{data.content}</p>
      <div className="level">
        <span>Priority level : </span>
        <Rate value={data.count} disabled></Rate>
        <p className="mt10">
          Created At : {formatDateTime(data.createdAt)}
        </p>
      </div>

      <div className="button-wrapper">
        <Popconfirm
          title="Are you sure you want to delete it?"
          onConfirm={handleAction.bind(null, 0)}
          placement="bottomLeft"
          okType="danger"
        >
          <Button
            type="primary"
            danger
            size="small"
          >
            Delete
          </Button>
        </Popconfirm>

        {(data.type === 1) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 1)}
          >
            Start
          </Button>
        )}
        {([2, 3].includes(data.type)) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 2)}
          >
            Go Back
          </Button>
        )}
        {(data.type === 2) && (
          <Button
            type="primary"
            size="small"
            onClick={handleAction.bind(null, 1)}
          >
            Complete
          </Button>
        )}
      </div>
    </Card>
  )
}

export default React.memo(TaskItem)
