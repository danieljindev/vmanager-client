/**
 * 公司单位
 */
import React, { useEffect, useRef } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import CreateCompanyModal from './CreateCompanyModal'
import { serviceGetAllCompany, serviceDelCompany } from '@/services'
import { Button, Popconfirm } from 'antd'
import { fromNow } from '@/utils'

interface State {
  showCreateCompanyModal: boolean
  detail: { [key: string]: any }
}

const initialState: State = {
  showCreateCompanyModal: false,
  detail: {}
}

const CompanyPage = () => {
  const [state, setState] = useKeepState(initialState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      width: 140
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      width: 110
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      width: 110,
      render: (endDate: string|null) => endDate ?? 'Up to now'
    },
    {
      title: 'Expect to Leave',
      dataIndex: 'expectLeaveDate',
      width: 130,
      render: (expectLeaveDate: string|null) => (
        expectLeaveDate && (
          <div>
            {expectLeaveDate}
            <div>{fromNow(Date.now(), expectLeaveDate)} days left</div>
          </div>
        )
      )
    },
    {
      title: 'Duration',
      dataIndex: 'id',
      width: 100,
      render: (_: unknown, record: any) =>
        fromNow(record.startDate, record.endDate) + ' days'
    },
    {
      title: 'Salary',
      dataIndex: 'amount',
      width: 100,
      render: (amount: string) => `$${amount}`
    },
    {
      title: 'Note',
      dataIndex: 'remark',
      className: 'wbba'
    },
    {
      title: 'Action',
      width: 170,
      align: 'right',
      fixed: 'right',
      render: (record: any) => (
        <>
          <Button onClick={() => handleEditCompany(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete it?"
            onConfirm={() => handleDelCompany(record)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ]

  function handleEditCompany(record: any) {
    setState({ detail: record })
    toggleCreateCompanyModal()
  }

  async function handleDelCompany(record: any) {
    await serviceDelCompany(record.id)
    tableRef.current.getTableData()
  }

  function getAllCompany() {
    return serviceGetAllCompany()
  }

  function toggleCreateCompanyModal() {
    setState({ showCreateCompanyModal: !state.showCreateCompanyModal })
  }

  const handleSuccess = function() {
    toggleCreateCompanyModal()
    tableRef.current.getTableData()
  }

  useEffect(() => {
    tableRef?.current?.getTableData()
  }, [])

  return (
    <div className="company">
      <Table
        ref={tableRef}
        getTableData={getAllCompany}
        columns={tableColumns}
        onDelete={serviceDelCompany}
        onAdd={() => setState({
          showCreateCompanyModal: true,
          detail: {}
        })}
      />

      <CreateCompanyModal
        visible={state.showCreateCompanyModal}
        onSuccess={handleSuccess}
        onCancel={toggleCreateCompanyModal}
        detail={state.detail}
      />
    </div>
  )
}

export default CompanyPage
