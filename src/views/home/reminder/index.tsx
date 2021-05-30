/**
 * Reminder
 */
import React, { useEffect, useRef } from 'react'
import Table from '@/components/table'
import moment from 'moment'
import CreateReminder from './CreateReminder'
import useKeepState from 'use-keep-state'
import { connect } from 'react-redux'
import { DatePicker, Button, Select, Tag, Modal, Form, Popconfirm } from 'antd'
import { serviceGetReminder, serviceDeleteReminder } from '@/services'
import { FORMAT_DATE, formatDateTime } from '@/utils'

const { RangePicker } = DatePicker
const Option = Select.Option
const STATUS_TYPE: any = {
  1: { color: '#f50', text: 'To be reminded' },
  2: { color: '#87d068', text: 'Reminded' }
}

interface State {
  showCreateModal: boolean
  currentRow: { [propName: string]: any } | null
}

type Props = ReturnType<typeof mapStateToProps>

const initialState: State = {
  showCreateModal: false,
  currentRow: null
}

const ReminderPage: React.FC<Props> = function({ userInfo }) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: 'Status',
      dataIndex: 'type',
      width: 140,
      render: (row: any) => (
        <Tag color={STATUS_TYPE[row].color}>
          {STATUS_TYPE[row].text}
        </Tag>
      )
    },
    {
      title: 'Reminder Date',
      dataIndex: 'createdAt',
      width: 220
    },
    {
      title: 'Reminder Content',
      dataIndex: 'content',
      className: 'wbba wpr'
    },
    {
      title: 'Action',
      width: 180,
      align: 'right',
      fixed: 'right',
      render: (record: any) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => handleDelete(record)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  const initParams = function() {
    const startDate = moment().startOf('year')
    const endDate = moment().endOf('year')
    form.setFieldsValue({
      queryType: '',
      date: [startDate, endDate]
    })
    tableRef?.current?.getTableData()
  }

  function getReminder(params: any = {}) {
    const values = form.getFieldsValue()

    if (values.date && values.date.length === 2) {
      params.startDate = values.date[0].format(FORMAT_DATE)
      params.endDate = values.date[1].format(FORMAT_DATE)
    }

    if (values.queryType !== '') {
      params.type = values.queryType
    }

    return serviceGetReminder(params).then(res => {
      if (res.data.success) {
        res.data.data.rows = res.data.data.rows.map((el: any, idx: number) => {
          el.order = idx + 1
          el.createdAt = formatDateTime(el.createdAt)
          return el
        })
      }
      return res
    })
  }

  function handleEdit(record: any) {
    setState({
      showCreateModal: true,
      currentRow: record
    })
  }

  function handleDelete(record: any) {
    serviceDeleteReminder(record.id)
      .then(res => {
        if (res.data.success) {
          tableRef.current.getTableData()
        }
      })
  }

  // modal成功新增回调函数
  function handleCloseModal() {
    setState({ showCreateModal: false })
    tableRef.current.getTableData()
  }

  useEffect(() => {
    initParams()

    if (!userInfo.email) {
      Modal.warning({
        title: 'Your email is not detected!',
        content: (
          <>
            Please make your GitHub mailbox public, otherwise it will affect the use of this feature，
            <a
              href="https://github.com/settings/profile"
              target="_blank"
              rel="noopener noreferrer"
            >
            Go to settings
            </a>
          </>
        ),
      })
    }
  }, [userInfo.email])

  return (
    <div className="reminder">
      <div className="query-panel">
        <Form
          form={form}
          layout="inline"
          onValuesChange={() => tableRef?.current?.getTableData()}
        >
          <Form.Item
            name="queryType"
            label="Status"
            initialValue=""
          >
            <Select>
              <Option value="">All</Option>
              <Option value="1">To be reminded</Option>
              <Option value="2">Reminded</Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Date">
            <RangePicker allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={() => tableRef.current.getTableData()}>Search</Button>
            <Button onClick={initParams}>Reset</Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        ref={tableRef}
        getTableData={getReminder}
        columns={tableColumns}
        onDelete={serviceDeleteReminder}
        onAdd={() => setState({ showCreateModal: true, currentRow: null })}
      />

      <CreateReminder
        visible={state.showCreateModal}
        rowData={state.currentRow}
        onCancel={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </div>
  )
}

const mapStateToProps = (store: any) => ({
  userInfo: store.user.userInfo
})

export default connect(mapStateToProps)(ReminderPage)
