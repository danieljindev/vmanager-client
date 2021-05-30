import React, { useEffect } from 'react'
import moment from 'moment'
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select
} from 'antd'
import { serviceCreateCapitalFlow, serviceUpdateCapitalFlow } from '@/services'
import useKeepState from 'use-keep-state'
import { filterOption, FORMAT_DATETIME } from '@/utils'

const { TextArea } = Input
const { Option } = Select

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

type Props = {
  visible: boolean
  onCancel: () => void
  onSuccess: (res?: any) => void
  rowData?: { [key: string]: any }
  nameList: any[]
}

interface State {
  confirmLoading: boolean
}

const initialState: State = {
  confirmLoading: false,
}

const CreateCapitalFlowModal: React.FC<Props> = function ({
  visible,
  onCancel,
  onSuccess,
  rowData,
  nameList
}) {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initialState)

  async function handleSubmit() {
    try {
      const values = await form.validateFields()
      const params = {
        date: values.date.format(FORMAT_DATETIME),
        remark: values.remark?.trim() ?? '',
        typeId: values.typeId,
        price: Number(values.price)
      }

      setState({ confirmLoading: true });

      (
        !rowData
          ? serviceCreateCapitalFlow(params)
          : serviceUpdateCapitalFlow(rowData.id, params)
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
    if (visible && rowData) {
      form.setFieldsValue({
        date: moment(rowData.createdAt),
        remark: rowData.remark,
        typeId: rowData.typeId,
        price: rowData.price,
      })
    }
  }, [visible, rowData])

  return (
    <Modal
      title="Create"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form form={form} preserve={false} {...formLayout}>
        <Form.Item
          label="Created At"
          name="date"
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
            className="w100"
          />
        </Form.Item>

        <Form.Item
          label="Capital Type"
          name="typeId"
          rules={[
            {
              required: true,
              message: "Please select a type."
            }
          ]}
        >
          <Select
            showSearch
            filterOption={filterOption}
          >
            {nameList.map((item: any) => (
              <Option value={item.id} key={item.id}>{item.optionName}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Amount"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter the amount"
            }
          ]}
        >
          <Input placeholder="Please enter the amount" prefix="$" />
        </Form.Item>

        <Form.Item
          label="Note"
          name="remark"
        >
          <TextArea
            rows={5}
            maxLength={250}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(CreateCapitalFlowModal)
