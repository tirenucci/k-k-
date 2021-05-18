import fecha from 'fecha';
import getMess from './Translation';

const TABLET_WIDTH = 1024;
const MOBILE_WIDTH = 640;

function formatSize(
    viewLayoutOptions, { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
) {
    if (cellData !== undefined && viewLayoutOptions.humanReadableSize) {
        return cellData + ' Ko'
    }

    return cellData || '—';
}

function formatDate(
    viewLayoutOptions, { cellData, columnData, columnIndex, dataKey, isScrolling, rowData, rowIndex }
) {
    if (cellData) {
        const { dateTimePattern } = viewLayoutOptions;
        return fecha.format(new Date().setTime(cellData), dateTimePattern);
    }

    return '';
}

const listViewLayout = (viewLayoutOptions) => {
    const getMessage = getMess.bind(null, viewLayoutOptions.locale);
    return [
        ({
            elementType: 'Column',
            elementProps: {
                key: "name",
                dataKey: "name",
                width: 48,
                label: getMessage('title'),
                flexGrow: 1,
                cellRenderer: {
                    elementType: 'NameCell',
                    callArguments: [viewLayoutOptions]
                },
                headerRenderer: {
                    elementType: 'HeaderCell',
                    callArguments: [viewLayoutOptions]
                },
                disableSort: false
            }
        }),
        ({
            elementType: 'Column',
            elementProps: {
                key: "size",
                width: 100,
                dataKey: "size",
                label: getMessage('fileSize'),
                flexGrow: 0,
                cellRenderer: {
                    elementType: 'Cell',
                    callArguments: [{ ...viewLayoutOptions, getData: formatSize }]
                },
                headerRenderer: {
                    elementType: 'HeaderCell',
                    callArguments: [viewLayoutOptions]
                },
                disableSort: true
            }
        }),
    ];
};

export default listViewLayout;