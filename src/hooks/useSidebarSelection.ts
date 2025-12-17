import {
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowSelectedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useRouter } from "next/navigation";
import { RefObject, useEffect } from "react";

type Props<T> = {
  rowData: T[];
  id: string;
  keyId: keyof T;
  gridRef: RefObject<AgGridReact<T> | null>;
  getPushLink: (data: T) => string;
};

const useSidebarSelection = <T>({
  rowData,
  id,
  keyId,
  gridRef,
  getPushLink,
}: Props<T>) => {
  const router = useRouter();

  const handlePreSelect = (api?: GridApi<T>) => {
    api?.forEachNode((node) => {
      if (node.data?.[keyId] == id) {
        node.setSelected(true);
      }
    });
  };
  useEffect(() => {
    if (gridRef?.current?.api && rowData) {
      if (id) {
        handlePreSelect(gridRef?.current?.api);
      } else {
        gridRef.current.api.deselectAll();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData, gridRef?.current?.api, id]);

  const onRowClicked = ({ node }: RowClickedEvent<T>) => {
    node?.setSelected(true);
    router.push(getPushLink(node.data as T));
    //  router.push(`/v1/sales-customers/customers/${node.data?.[keyId]}`);
  };
  const onRowSelected = ({ api }: RowSelectedEvent<T>) => {
    const selectedNode = api.getSelectedNodes()[0];
    selectedNode?.setSelected(true);
    if (selectedNode) {
      // Scroll the selected row into view
      api.ensureNodeVisible(selectedNode);

      // Set focus on the first cell of the selected row
      api.setFocusedCell(selectedNode.rowIndex || 1000, "name");
    }
  };

  const onGridReady = (event: GridReadyEvent<T>) => {
    handlePreSelect(event.api);
  };
  return { gridRef, onRowClicked, onRowSelected, onGridReady };
};

export default useSidebarSelection;
