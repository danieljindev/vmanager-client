import React, { useEffect } from 'react'
import moment from 'moment'
import useKeepState from 'use-keep-state'
import {
  Modal,
  Form,
  Input,
  DatePicker
} from 'antd'
import { serviceCreateReminder, serviceUpdateReminder } from '@/services'
import { isBefore, formatDateTime } from '@/utils'

const { TextArea } = Input

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: { [key: string]: any }
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false
}

const formLayoutItem = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  },
}

const CreateReminder: React.FC<Props> = function ({
  visible,
  rowData,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmitForm() {
    try {
      const values = await form.validateFields()
      const params = {
        date: formatDateTime(values.date),
        content: values.content.trim()
      }

      setState({ confirmLoading: true });

      (
        !rowData
          ? serviceCreateReminder(params)
          : serviceUpdateReminder(rowData.id, params)
      )
      .then(res => {
        if (res.data.success) {
          onSuccess(res)
        }
      })
      .finally(() => {
        setState({ confirmLoading: false })
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }

    if (visible && rowData) {
      form.setFieldsValue({
        date: moment(rowData.createdAt),
        content: rowData.content
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="Create"
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem}>
        <Form.Item
          name="date"
          label="Date"
          rules={[
            {
              required: true,
              message: "Please choose a time."
            }
          ]}
        >
          <DatePicker
            showTime
            allowClear={false}
            disabledDate={isBefore}
            className="w100"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[
            {
              required: true,
              message: "Please enter content."
            }
          ]}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="Please enter content."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateReminder)
