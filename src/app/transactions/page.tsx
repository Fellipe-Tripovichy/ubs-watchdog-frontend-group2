"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectToken } from "@/features/auth/authSlice";
import {
  fetchTransactions,
  selectTransactions,
  selectAllTransactionsLoading,
} from "@/features/transactions/transactionsSlice";

import { HeroTitle } from "@/components/ui/heroTitle";
import { DataTable } from "@/components/table/dataTable";
import { CardTable } from "@/components/table/cardTable";
import { getTransactionsColumns, CURRENCIES } from "@/models/transactions";
import { TransactionCard } from "@/components/transactions/transactionCard";
import { SectionTitle } from "@/components/ui/sectionTitle";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { IconButton } from "@/components/ui/iconButton";
import { LinkButton } from "@/components/ui/linkButton";
import Link from "next/link";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const transactions = useAppSelector(selectTransactions);
  const isLoading = useAppSelector(selectAllTransactionsLoading);

  const [tipo, setTipo] = React.useState<string>("all");
  const [moeda, setMoeda] = React.useState<string>("all");
  const [dataInicio, setDataInicio] = React.useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = React.useState<Date | undefined>(undefined);
  const [showFilters, setShowFilters] = React.useState(false);

  const columns = React.useMemo(() => getTransactionsColumns(), []);

  React.useEffect(() => {
    if (!token) return;

    const dataInicioISO = dataInicio ? dataInicio.toISOString() : undefined;
    const dataFimISO = dataFim ? dataFim.toISOString() : undefined;

    dispatch(
      fetchTransactions({
        token,
        tipo: tipo !== "all" ? (tipo as "Deposito" | "Saque" | "Transferencia") : undefined,
        moeda: moeda !== "all" ? moeda : undefined,
        dataInicio: dataInicioISO,
        dataFim: dataFimISO,
      })
    );
  }, [token, dispatch, tipo, moeda, dataInicio, dataFim]);

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full">
        <div className="w-full relative">
          <img
            src="/banner-transactions.jpg"
            alt="Transações"
            className="h-[240px] w-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-start">
            <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8">
              <div className="bg-background/95 p-6 z-5 flex flex-col items-start justify-start w-full md:w-3/5 lg:w-2/5">
                <HeroTitle
                  as="h1"
                  subtitle="Administração de Depósitos, Transferências, Saques e Histórico Global."
                >
                  Transações
                </HeroTitle>
              </div>
            </div>
          </div>
        </div>


        <div className="flex flex-col  max-w-[1554px] mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <SectionTitle>Histórico de transações</SectionTitle>
            <Link href="/transactions/new-transaction" className="w-auto">
              <Button variant="default" className="w-auto" size="small">
                Nova transação
              </Button>
            </Link>
          </div>
          <div className="w-full mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1"></div>
              <div className="flex items-center justify-end block md:hidden">
                <IconButton icon={showFilters ? "x" : "filter"} variant="secondary" size="small" onClick={() => setShowFilters(!showFilters)} className={showFilters ? "text-foreground bg-muted" : ""} />
              </div>
            </div>
            {(() => {
              const filterContent = (
                <>
                  <div className="flex flex-col md:flex-row gap-4 items-center md:items-end">
                    <div className="flex-1 w-full md:max-w-[172px]">
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Tipo
                      </label>
                      <Select value={tipo} onValueChange={setTipo}>
                        <SelectTrigger size="default" className="w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Deposito">Depósito</SelectItem>
                        <SelectItem value="Saque">Saque</SelectItem>
                        <SelectItem value="Transferencia">Transferência</SelectItem>
                      </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Moeda
                      </label>
                      <Select value={moeda} onValueChange={setMoeda}>
                        <SelectTrigger size="default" className="w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <DatePickerInput
                        disabled={false}
                        label="Data Início"
                        value={dataInicio}
                        onChange={setDataInicio}
                        maxDate={dataFim}
                        placeholder="dd/mm/aaaa"
                      />
                    </div>

                    <div className="flex-1 w-full md:max-w-[172px]">
                      <DatePickerInput
                        disabled={false}
                        label="Data Fim"
                        value={dataFim}
                        onChange={setDataFim}
                        minDate={dataInicio}
                        placeholder="dd/mm/aaaa"
                      />
                    </div>

                    <LinkButton
                      variant="default"
                      size="small"
                      type="button"
                      onClick={() => {
                        setTipo("all");
                        setMoeda("all");
                        setDataInicio(undefined);
                        setDataFim(undefined);
                      }}
                    >
                      Limpar filtros
                    </LinkButton>
                  </div>
                </>
              );

              return (
                <>
                  {showFilters && (
                    <div className="flex flex-col gap-2 mt-4 block md:hidden">
                      {filterContent}
                    </div>
                  )}
                  <div className="flex flex-col gap-2 mt-4 hidden md:block">
                    {filterContent}
                  </div>
                </>
              );
            })()}
          </div>
          <div className="w-full hidden md:block">
            <DataTable
              columns={columns}
              data={transactions}
              itemsPerPage={10}
              getRowKey={(transaction) => transaction.id}
              loading={isLoading}
              emptyMessage="Nenhuma transação encontrada"
              emptyDescription="Nenhuma transação encontrada para exibir. Altere os filtros para encontrar transações ou entre em contato com o suporte. "
            />
          </div>
          <div className="block md:hidden">
            <CardTable
              data={transactions}
              itemsPerPage={10}
              getRowKey={(transaction) => transaction.id}
              renderCard={(transaction) => <TransactionCard transaction={transaction} />}
              loading={isLoading}
              emptyMessage="Nenhuma transação encontrada"
              emptyDescription="Nenhuma transação encontrada para exibir. Altere os filtros para encontrar transações ou entre em contato com o suporte. "
            />
          </div>
        </div>
      </div>

    </div>
  );
}
