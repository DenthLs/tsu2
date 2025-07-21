import React, { useState, useEffect, useRef } from 'react';
import './Panel.css';
import productsData from './assets/products.json';
const Panel = () => {

    const [activeTab, setActiveTab] = useState('Случайный цвет');
    const [tabs] = useState([
        'Случайный цвет', 'Продукты', 'Таблица', 'График'
    ]);



    const SquareGenerator = () => {
        const [dimensions, setDimensions] = useState({
            width: '100',
            height: '100'
        });
        const [square, setSquare] = useState(null);

        const handleDimensionChange = (e) => {
            const { name, value } = e.target;

            const cleanedValue = value.replace(/\D/g, '');
            if (cleanedValue !== '' || value === '') {
                setDimensions(prev => ({
                    ...prev,
                    [name]: cleanedValue
                }));
            }
        };

        const generateSquare = () => {
            const width = parseInt(dimensions.width) || 100;
            const height = parseInt(dimensions.height) || 100;
            const newSquare = {
                id: Date.now(),
                width,
                height,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`
            };
            setDimensions({
                width: width.toString(),
                height: height.toString()
            });
            setSquare(newSquare);
        };

        return (
            <div>
                <div className="controls">
                    <label>
                        Ширина:
                        <input
                            type="text"
                            name="width"
                            value={dimensions.width}
                            onChange={handleDimensionChange}
                            placeholder="100"
                        />
                    </label>

                    <label>
                        Высота:
                        <input
                            type="text"
                            name="height"
                            value={dimensions.height}
                            onChange={handleDimensionChange}
                            placeholder="100"
                        />
                    </label>
                    <button onClick={generateSquare}>Создать квадрат</button>
                </div>
                <div className="squares-container">
                    {square && (
                        <div
                            className="square"
                            style={{
                                width: `${square.width}px`,
                                height: `${square.height}px`,
                                backgroundColor: square.color,
                                margin: '20px auto'
                            }}
                            title={`${square.width}x${square.height}px, ${square.color}`}
                        />
                    )}
                </div>
            </div>
        );
    };

    const ProductTable = () => {
        const [products, setProducts] = useState([]);
        const [minPrice, setMinPrice] = useState(0);
        const [maxPrice, setMaxPrice] = useState(1000);

        useEffect(() => {
            setProducts(productsData);
        }, []);

        const filteredProducts = products.filter(
            p => p.price >= minPrice && p.price <= maxPrice
        );

        return (
            <div>
                <div className="price-filters">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                        placeholder="Мин. цена"
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                        placeholder="Макс. цена"
                    />
                </div>
                <table className="products-table">
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Сумма</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price} ₽</td>
                            <td>{product.quantity * product.price} ₽</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const EditableTable = () => {
        const [tableData, setTableData] = useState(() => {
            const saved = localStorage.getItem('tableData');
            return saved ? JSON.parse(saved) : [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ];
        });

        const [rows, setRows] = useState(tableData.length);
        const [cols, setCols] = useState(tableData[0].length);

        useEffect(() => {
            localStorage.setItem('tableData', JSON.stringify(tableData));
        }, [tableData]);

        const handleCellChange = (rowIndex, colIndex, value) => {
            const newData = [...tableData];
            newData[rowIndex][colIndex] = value;
            setTableData(newData);
        };

        const addRow = () => {
            setTableData([...tableData, Array(cols).fill('')]);
            setRows(rows + 1);
        };

        const removeRow = () => {
            if (rows > 1) {
                setTableData(tableData.slice(0, -1));
                setRows(rows - 1);
            }
        };

        const addColumn = () => {
            setTableData(tableData.map(row => [...row, '']));
            setCols(cols + 1);
        };

        const removeColumn = () => {
            if (cols > 1) {
                setTableData(tableData.map(row => row.slice(0, -1)));
                setCols(cols - 1);
            }
        };

        return (
            <div>
                <table className="editable-table">
                    <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>
                                    <input
                                        type="text"
                                        value={cell}
                                        onChange={(e) =>
                                            handleCellChange(rowIndex, colIndex, e.target.value)
                                        }
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="table-controls">
                    <button onClick={addRow}>+ Строка</button>
                    <button onClick={removeRow}>- Строка</button>
                    <button onClick={addColumn}>+ Колонка</button>
                    <button onClick={removeColumn}>- Колонка</button>
                </div>
            </div>
        );
    };

    const CpuChart = () => {
        const [data, setData] = useState([]);
        const maxPoints = 10;
        const chartRef = useRef(null);

        useEffect(() => {
            const interval = setInterval(() => {
                const newValue = Math.floor(Math.random() * 100) + 1;
                setData(prev => {
                    const newData = [...prev, newValue];
                    return newData.slice(-maxPoints);
                });
            }, 5000);

            return () => clearInterval(interval);
        }, []);

        useEffect(() => {
            if (chartRef.current && data.length > 0) {
                drawChart();
            }
        }, [data]);

        const drawChart = () => {
            const canvas = chartRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // Оси
            ctx.beginPath();
            ctx.moveTo(30, 20);
            ctx.lineTo(30, height - 20);
            ctx.lineTo(width - 20, height - 20);
            ctx.strokeStyle = '#000';
            ctx.stroke();

            // График
            ctx.beginPath();
            const step = (width - 50) / (maxPoints - 1);
            data.forEach((value, i) => {
                const x = 30 + (i * step);
                const y = height - 20 - (value * (height - 40) / 100);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.strokeStyle = '#f00';
            ctx.stroke();

            // Подписи
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            data.forEach((value, i) => {
                const x = 30 + (i * step);
                const y = height - 5;
                ctx.fillText(i + 1, x, y);
            });

            ctx.textAlign = 'right';
            for (let i = 0; i <= 100; i += 20) {
                const y = height - 20 - (i * (height - 40) / 100);
                ctx.fillText(`${i}%`, 25, y + 5);
            }
        };

        return (
            <div className="chart-container">
                <h3>Нагрузка CPU</h3>
                <canvas
                    ref={chartRef}
                    width="600"
                    height="300"
                />
                <div className="chart-info">
                    Текущая нагрузка: {data.length > 0 ? `${data[data.length - 1]}%` : '0%'}
                </div>
            </div>
        );
    };

    return (
        <div className="panel">
            <div className="tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.replace('-', ' ')}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === 'Случайный цвет' && <SquareGenerator />}
                {activeTab === 'Продукты' && <ProductTable />}
                {activeTab === 'Таблица' && <EditableTable />}
                {activeTab === 'График' && <CpuChart />}
            </div>
        </div>
    );
};

export default Panel;