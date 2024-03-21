<template>
    <div>
      <table>
        <thead>
          <tr>
            <th>Client Code</th>
            <th>Client Name</th>
            <th>Client Class</th>
            <th>Client Boss</th>
            <th>Client Where</th>
            <th>Client Post</th>
            <th>Client Emp</th>
            <th>Client EmpTel</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.clientCode">
            <td>{{ client.clientCode }}</td>
            <td>{{ client.clientName }}</td>
            <td>{{ client.clientClass }}</td>
            <td>{{ client.clientBoss }}</td>
            <td>{{ client.clientWhere }}</td>
            <td>{{ client.clientPost }}</td>
            <td>{{ client.clientEmp }}</td>
            <td>{{ client.clientEmpTel }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        clients: []
      };
    },
    mounted() {
      this.fetchClients();
    },
    methods: {
      async fetchClients() {
        try {
          const response = await axios.get('http://localhost:8081/clients/list'); // 실제 백엔드 URL을 사용하세요.
          this.clients = response.data;
        } catch (error) {
          console.error('There was an error fetching the clients:', error);
        }
      }
    }
  };
  </script>
  
  <style>
  /* 테이블 스타일링 */
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  thead {
    background-color: #f9f9f9;
  }
  </style>