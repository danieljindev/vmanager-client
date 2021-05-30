/**
 * 创建单位
 */
import React, { useEffect } from 'react'
import useKeepState from 'use-keep-state'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber
} from 'antd'
import { serviceCreateCompany, serviceUpdateCompany } from '@/services'
import { formatDate } from '@/utils'
import moment from 'moment'

const { TextArea } = Input

const formLayoutItem = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  },
}

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  detail: { [key: string]: any }
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false
}

const CreateCompanyModal: React.FC<Props> = function ({
  visible,
  detail,
  onCancel,
  onSuccess,
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  const isEdit = detail.id
  const title = isEdit ? 'Edit' : 'Create'

  async function handleSubmitForm() {
    try {
      setState({ confirmLoading: true })

      const values = await form.validateFields()
      const params: any = {
        companyName: values.companyName,
        startDate: formatDate(values.startDate),
        amount: Number(values.amount),
        remark: values.remark.trim(),
      }

      if (values.endDate) {
        params.endDate = formatDate(values.endDate)
      }
      if (values.expectLeaveDate) {
        params.expectLeaveDate = formatDate(values.expectLeaveDate)
      }

      (
        !isEdit
          ? serviceCreateCompany(params)
          : serviceUpdateCompany(detail.id, params)
      )
      .then(res => {
        if (res.data.success) {
          onSuccess()
        }
      })
      .finally(() => {
        setState({ confirmLoading: false })
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayoutItem}>
        <Form.Item
          name="companyName"
          label="Name"
          initialValue={detail.companyName}
          rules={[
            {
              required: true,
              message: "Please enter the name of the company."
            }
          ]}
        >
          <Input
            maxLength={200}
            placeholder="Please enter the name of the company."
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          initialValue={detail.startDate && moment(detail.startDate)}
          rules={[
            {
              required: true,
              message: "Please select a date."
            }
          ]}
        >
          <DatePicker allowClear={false} className="w100" />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          initialValue={detail.endDate && moment(detail.endDate)}
        >
          <DatePicker className="w100" />
        </Form.Item>

        <Form.Item
          name="expectLeaveDate"
          label="Expect to Leave"
          initialValue={detail.expectLeaveDate && moment(detail.expectLeaveDate)}
        >
          <DatePicker className="w100" />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Salary"
          initialValue={detail.amount}
          rules={[
            {
              required: true,
              message: "Please enter salary."
            }
          ]}
        >
          <InputNumber min={1} max={99999999} className="w100" placeholder="Please enter salary" />
        </Form.Item>

        <Form.Item
          name="remark"
          label="Note"
          initialValue={detail.remark ?? ''}
        >
          <TextArea
            rows={3}
            maxLength={200}
            placeholder="Please enter Note"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateCompanyModal)
